from rest_framework.permissions import BasePermission

class IsHR(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role.lower() == "hr"
        )


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role.lower() == "candidate"
        )


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role.lower() == "employee"
        )
