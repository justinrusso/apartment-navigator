import boto3
import os
import uuid

BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
BASE_PATH = f"https://{BUCKET_NAME}.s3.amazonaws.com/"


s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("AWS_KEY"),
    aws_secret_access_key=os.environ.get("AWS_SECRET"),
)


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file(file, filename):
    filename = filename or file.filename
    s3_client.upload_fileobj(
        file,
        BUCKET_NAME,
        filename,
        ExtraArgs={"ContentType": file.content_type},
    )

    return f"{BASE_PATH}{filename}"


def delete_file(filename):
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=filename)
