# 발품 프로젝트

<p align="center">
  <img src="./doc/img/logo.jpeg"/>
</p>

# 개발 환경

## CDK
```
$ node -v
$ npm -v
$ npm install # 의존성 설치

$ aws --version
$ aws configure # aws credential로 profile 설정
```
```
$ cdk bootstrap --profile [YOUR AWS PROFILE] # 해당 account에서 첫 cdk 실행일 때
$ cdk synth
$ cdk deploy --profile [YOUR AWS PROFILE] # cdk 배포
$ cdk destroy --profile [YOUR AWS PROFILE] # cdk 회수
```

## Python
```
$ pip install pipenv
$ pipenv install # 의존성 설치
$ pipenv shell # 가상환경 실행
```

## pre-commit
- 자동화된 코드 품질 보장을 위해 pre-commit 적용
```
$ pre-commit run --all-files
```
- 개별 적용
```
$ npm run lint
$ npm run test

$ black .
$ pytest .
```

## 로컬 실행
```
$ cd api && uvicorn main:app --host 0.0.0.0 --port 80
$ cd view && flutter run
```
- flutter setup은 [여기](https://docs.flutter.dev/get-started/install)를 참고