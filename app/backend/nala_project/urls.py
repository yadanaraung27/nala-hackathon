from django.urls import path
from dashboard.views import (
    SampleProtectedEndpointView,
    KPIView,
    AnalyticsContentTopicTypeView,
    AnalyticsTopicView,
    AnalyticsConversationView,
)

urlpatterns = [
    path("sample/", SampleProtectedEndpointView.as_view(), name="sample"),
    path("kpi/", KPIView.as_view(), name="kpi"),
    path(
        "content-topic-type/<str:date_range>/",
        AnalyticsContentTopicTypeView.as_view(),
        name="content-topic-type",
    ),
    path("topic/<str:date_range>/", AnalyticsTopicView.as_view(), name="topic"),
    path(
        "conversation-trend/<str:date_range>/",
        AnalyticsConversationView.as_view(),
        name="conversations",
    ),
]

"""
URL configuration for nala_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path("admin/", admin.site.urls),
# ]
