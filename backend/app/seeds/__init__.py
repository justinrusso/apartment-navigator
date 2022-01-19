from faker import Faker
from flask.cli import AppGroup

from .users import seed_users, undo_users


seed_commands = AppGroup("seed")


@seed_commands.command("all")
def seed():
    fake = Faker()
    # Add seed functions here
    seed_users(fake)


@seed_commands.command("undo")
def undo():
    # Add undo functions here
    undo_users()
