
# Create your tests here.
def get_client_ip(request):
    # 取得真實的 client IP，考慮到是否經過 Proxy 或 Load Balancer
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # 如果有轉送標頭，可能會有多個 IP，以逗號分隔
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        # 沒有經過代理，直接取 REMOTE_ADDR
        ip = request.META.get('REMOTE_ADDR')
    return ip