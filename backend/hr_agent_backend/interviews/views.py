from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import InterviewSlot, Interview
from .serializers import InterviewSlotSerializer, InterviewSerializer
from accounts.permissions import IsHR, IsCandidate
from .email_service import send_interview_email


# ===============================
# HR CREATES INTERVIEW SLOTS
# ===============================
class CreateInterviewSlotView(APIView):
    permission_classes = [IsHR]

    def post(self, request):
        job_id = request.data.get("job")

        if not job_id:
            return Response(
                {"error": "job field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = InterviewSlotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

# ===============================
# AVAILABLE SLOTS (HR + CANDIDATE)
# ===============================
class AvailableSlotsView(APIView):
    permission_classes = [IsHR | IsCandidate]

    def get(self, request, job_id):
        if request.user.role.lower() == "hr":
            # HR sees all slots
            slots = InterviewSlot.objects.filter(job_id=job_id)
        else:
            # Candidate sees only free slots
            slots = InterviewSlot.objects.filter(
                job_id=job_id,
                is_booked=False
            )

        serializer = InterviewSlotSerializer(slots, many=True)
        return Response(serializer.data)


# ===============================
# CANDIDATE BOOKS SLOT
# ===============================
class BookSlotView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, slot_id):
        try:
            slot = InterviewSlot.objects.get(
                id=slot_id,
                is_booked=False
            )
        except InterviewSlot.DoesNotExist:
            return Response(
                {"error": "Slot not available"},
                status=400
            )

        slot.is_booked = True
        slot.save()

        interview = Interview.objects.create(
            candidate=request.user,
            job=slot.job,
            slot=slot
        )

        send_interview_email(interview)

        return Response(
            {"message": "Interview scheduled & email sent"},
            status=201
        )


# ===============================
# CANDIDATE – MY INTERVIEWS
# ===============================
class MyInterviewView(APIView):
    permission_classes = [IsCandidate]

    def get(self, request):
        interviews = Interview.objects.filter(candidate=request.user)
        serializer = InterviewSerializer(interviews, many=True)
        return Response(serializer.data)


# ===============================
# HR – BOOKED INTERVIEWS (JOB WISE)
# ===============================
class HRBookedInterviewsView(APIView):
    permission_classes = [IsHR]

    def get(self, request, job_id):
        interviews = Interview.objects.filter(job_id=job_id)
        serializer = InterviewSerializer(interviews, many=True)
        return Response(serializer.data)
