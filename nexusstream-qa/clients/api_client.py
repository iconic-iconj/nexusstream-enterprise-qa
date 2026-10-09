import httpx


class APIClient:
    def __init__(self, base_url: str):
        self.client = httpx.Client(base_url=base_url,timeout=30.0,)

    def get(self, path: str, **kwargs):
        return self.client.get(path, **kwargs)

    def post(self, path: str, **kwargs):
        return self.client.post(path, **kwargs)

    def close(self):
        self.client.close()
