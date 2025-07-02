.PHONY: poetry

poetry.requirements:
	poetry export -f requirements.txt --output requirements.txt --without-hashes

poetry.run:
	poetry install
	poetry run llmer