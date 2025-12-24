from rest_framework import serializers
from .models import CandidateResume

class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateResume
        fields = ('id', 'job', 'resume_file')


class ResumeScoreSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="candidate.email", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = CandidateResume
        fields = (
            'id',
            'email',
            'job_title',  
            'score',
            'status',
            'uploaded_at'
        )
