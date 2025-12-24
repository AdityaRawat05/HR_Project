from django.urls import path
from .views import MyResumesView, ResumeUploadView ,RankedCandidatesView,UpdateCandidateStatusView

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('ranked/<int:job_id>/', RankedCandidatesView.as_view(), name='ranked-candidates'),
     path(
        "update-status/<int:resume_id>/",
        UpdateCandidateStatusView.as_view(),
        name="update-candidate-status"
    ),
    path("my-resumes/", MyResumesView.as_view()),

]
