from rest_framework import serializers
from .models import InterviewSlot, Interview


class InterviewSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSlot
        fields = ["id", "date", "start_time", "end_time", "is_booked"]


class InterviewSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    candidate_email = serializers.EmailField(
        source="candidate.email", read_only=True
    )
    slot = InterviewSlotSerializer(read_only=True)

    class Meta:
        model = Interview
        fields = [
            "id",
            "job_title",
            "candidate_email",
            "slot",
        ]
