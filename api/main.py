from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def read_root():
    """Hello World API

    Parameters:
        None
    Returns:
        dict: A dictionary with a message key
    """
    return {"message": "Hello World"}
