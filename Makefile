# binary aliases
TF = terraform -chdir=./infrastructure/

# variables
PROJECT=auth
ENVIRONMENT=dev

##@ Dependencies
.PHONY: install install-tools

install: install-tools ## Install all dependencies

install-tools: ## Install tooling
	asdf install

##@ Lint
.PHONY: lint lint-fix lint-tf lint-tf-fix

lint: lint-tf ## Run all linters

lint-fix: lint-tf-fix ## Attempt to automagically fiax all linting issues

lint-tf: ## Lint terraform code
	@echo "Linting Terraform"
	$(TF) validate
	$(TF) init -backend=false
	$(TF) fmt -check -recursive

lint-tf-fix: ## Auto fix terraform linting errors
	@echo "Fixing Terraform linting"
	$(TF) init -backend=false
	$(TF) fmt -recursive

##@ Build
.PHONY: build

build: ## Build Nuxt
	npm run build

start: ## Start dev server
	npm run dev

##@ Deployment
.PHONY: tf-init tf-plan tf-apply

upload: ## Upload static files to Cloudflare Pages
	@echo "Uploading SPA to S3"
	$(TF) workspace select ${ENVIRONMENT}
	bash scripts/upload.sh

deploy: build upload ## Build and deploy

tf-init: ## Initialise terraform
	@echo "Initialising terraform"
	$(TF) init

tf-plan: ## Plan terraform changeset
	@echo "Creating terraform plan"
	$(TF) workspace select ${ENVIRONMENT}
	$(TF) plan -input=false -out=./${PROJECT}.tfplan

tf-apply: ## Apply terraform changeset
	@echo "Applying terraform plan"
	$(TF) workspace select ${ENVIRONMENT}
	$(TF) apply -input=false -auto-approve ./${PROJECT}.tfplan

tf-output: ## write TF outputs to file
	@echo "Writing terraform outputs to file(s)"
	$(TF) workspace select ${ENVIRONMENT}
	$(TF) output -raw nuxt > ./.env
	$(TF) output -raw nuxt_deploy > ./.deploy.json

##@ Helpers
.PHONY: help

help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
