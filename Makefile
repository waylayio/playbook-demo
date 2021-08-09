default: build

build:
	docker build -t eu.gcr.io/quiet-mechanic-140114/no-code-demo:latest .

publish:
	gcloud docker -- push eu.gcr.io/quiet-mechanic-140114/no-code-demog