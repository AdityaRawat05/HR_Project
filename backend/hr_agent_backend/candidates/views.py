from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    ResumeUploadSerializer,
    ResumeScoreSerializer
)
from .models import CandidateResume
from .utils import extract_text
from accounts.permissions import IsCandidate, IsHR
from .ai_engine import calculate_score

class MyResumesView(APIView):
    permission_classes = [IsCandidate]

    def get(self, request):
        resumes = CandidateResume.objects.filter(candidate=request.user)
        serializer = ResumeScoreSerializer(resumes, many=True)
        return Response(serializer.data)

# ================= RESUME UPLOAD + AI SCORING =================
class ResumeUploadView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            resume = serializer.save(candidate=request.user)

            # Extract resume text
            text = extract_text(resume.resume_file.path)
            resume.extracted_text = text

            # AI scoring
            job_text = resume.job.description
            score = calculate_score(text, job_text)

            resume.score = score
            resume.status = "SHORTLISTED" if score >= 60 else "REJECTED"
            resume.save()

            return Response(
                {
                    "message": "Resume processed successfully",
                    "score": score,
                    "status": resume.status,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================= HR: VIEW RANKED CANDIDATES =================
class RankedCandidatesView(APIView):
    permission_classes = [IsHR]

    def get(self, request, job_id):
        resumes = CandidateResume.objects.filter(
            job_id=job_id
        ).order_by("-score")

        serializer = ResumeScoreSerializer(resumes, many=True)
        return Response(serializer.data)


# ================= HR: UPDATE CANDIDATE STATUS =================
class UpdateCandidateStatusView(APIView):
    permission_classes = [IsHR]

    def patch(self, request, resume_id):
        try:
            resume = CandidateResume.objects.get(id=resume_id)
        except CandidateResume.DoesNotExist:
            return Response(
                {"error": "Resume not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")

        # Allowed status values
        if new_status not in ["SHORTLISTED", "REJECTED"]:
            return Response(
                {"error": "Invalid status value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume.status = new_status
        resume.save()

        return Response(
            {
                "message": "Candidate status updated successfully",
                "status": resume.status
            },
            status=status.HTTP_200_OK
        )
