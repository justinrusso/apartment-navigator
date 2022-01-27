from faker import Faker
from flask.cli import AppGroup

from .properties import seed_properties, undo_properties
from .reviews import seed_reviews, undo_reviews
from .users import seed_users, undo_users


seed_commands = AppGroup("seed")


@seed_commands.command("all")
def seed():
    fake = Faker()

    seed_users(fake)
    seed_properties()
    seed_reviews()


@seed_commands.command("undo")
def undo():
    undo_users()
    undo_properties()
    undo_reviews()
