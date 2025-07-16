from django.urls import path
from .views import  FileUpload_view, searchlist, Downloadfile, deletefile, Previewfile
# from myapp.views import TokenRefreshView

urlpatterns = [
    path('upload/', FileUpload_view, name='FileUpload_view'),
    path('searchlist/', searchlist, name='searchlist'),
    path('download/', Downloadfile, name='Downloadfile'),
    path('deletefile/', deletefile, name='deletefile'),
    path('Previewfile/', Previewfile, name='Previewfile'),
    
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]

