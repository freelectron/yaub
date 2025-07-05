.PHONY: poetry

poetry.requirements:
	poetry export -f requirements.txt --output requirements.txt --without-hashes

poetry.run:
	poetry install
	@bash -c 'set -a && source ../.env && set +a && poetry run llmer'