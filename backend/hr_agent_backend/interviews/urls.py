from django.urls import path
from .views import (
    CreateInterviewSlotView,
    AvailableSlotsView,
    BookSlotView,
    MyInterviewView,
    HRBookedInterviewsView
)

urlpatterns = [
    path("slots/create/", CreateInterviewSlotView.as_view()),
    path("slots/<int:job_id>/", AvailableSlotsView.as_view()),
    path("book/<int:slot_id>/", BookSlotView.as_view()),
    path("my/", MyInterviewView.as_view()),
    path("booked/<int:job_id>/", HRBookedInterviewsView.as_view()),
]
