import datetime
import json
import os
import random

from app.models import db, Property, Review, ReviewSummary, User


def seed_reviews():
    file_path = os.path.join(os.path.dirname(__file__), "reviews.json")
    f = open(file_path, "r")
    data = json.load(f)

    start_date = datetime.date.today() - datetime.timedelta(days=30)
    end_date = datetime.date.today()
    days_between = (end_date - start_date).days

    user_ids = [user.id for user in User.query.all()]

    for property_id, reviews in data.get("property_reviews", dict()).items():
        property = Property.query.get(int(property_id))

        total = 0
        total_rating = 0

        blacklisted_users = [property.owner_id]

        for review_data in reviews:
            random_date = start_date + datetime.timedelta(
                days=random.randrange(days_between)
            )
            total += 1
            total_rating += review_data.get("rating")
            user_id = random.choice(
                [user_id for user_id in user_ids if user_id not in blacklisted_users]
            )

            property.reviews.append(
                Review(
                    user_id=user_id,
                    rating=review_data.get("rating"),
                    comment=review_data.get("comment"),
                    created_at=random_date,
                    updated_at=random_date,
                )
            )
            blacklisted_users.append(user_id)

        property.review_summary = ReviewSummary(
            total=total,
            average_rating=(total_rating / total) * 10,
        )
        db.session.add(property)
    db.session.commit()


def undo_reviews():
    db.session.execute("TRUNCATE properties RESTART IDENTITY CASCADE;")
    db.session.commit()
