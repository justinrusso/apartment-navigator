import random


from app.models import db, User


def seed_users(fake):
    demo_user = User(
        username="Demo",
        email="demo@aa.io",
        password="password",
        first_name="Demo",
        last_name="User",
    )

    db.session.add(demo_user)

    for _ in range(5):
        fake_profile = fake.profile()
        db.session.add(
            User(
                username=fake_profile["username"],
                email=fake.email(),
                password=fake.password(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                company=random.choice([None, fake.company()]),
            )
        )

    db.session.commit()


def undo_users():
    # Uses a raw SQL query to TRUNCATE the users table.
    # SQLAlchemy doesn't have a built in function to do this
    # TRUNCATE Removes all the data from the table, and RESET IDENTITY
    # resets the auto incrementing primary key, CASCADE deletes any
    # dependent entities
    db.session.execute("TRUNCATE users RESTART IDENTITY CASCADE;")
    db.session.commit()
