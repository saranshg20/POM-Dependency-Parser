FROM python:3.9

# Create a working directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

# Set the default port to 5000
ENV PORT=5000

CMD ["python", "server.py"]



