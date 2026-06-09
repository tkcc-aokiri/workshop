from app import create_app


def test_index_page_is_served() -> None:
    app = create_app()
    client = app.test_client()

    response = client.get("/")

    assert response.status_code == 200
    html = response.data.decode("utf-8")
    assert "Pomodoro" in html
    assert "remaining-time" in html
