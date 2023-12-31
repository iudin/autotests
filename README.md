## Autotests

**Из данного репозитория удалены все данные, позволяющие идентифицировать компанию, для которой эти тесты написаны. Он служит лишь примером подхода к организации автотестов и создан для сохранения опыта, полученного мной в ходе работы над этим проектом.**

### Инициализация проекта:

```sh
npm ci
npm run e2e
```

Проект запустит процесс в вкладке терминала где был вызван.

### Конфигурация проекта:

* HEADLESS=true - запуск проекта в "безголовом" режиме - т.е без отображения выполнения тестов в браузере - но результат будет виден в консоли

## Инструментарий

Тесты пишутся на [Typescript](https://www.typescriptlang.org/) с использованием библиотеки [codecept.js](https://codecept.io/)

Важная особенность: здесь мы стремимся сделать тестовые сценарии лаконичными и понятными. А вся низкоуровневая логика сосредоточена в объектах `pages` и `steps`. PageObjects реализованы в виде синглтонов, привязаны к конкретной странице сайта и "размечают" ее для тестирования. В `steps` содержится функциональность, привязанная к конкретным задачам пользователя, задачи могут содержать в себе проход по нескольким страницам.

Вот пара статей, которыми мы вдохновлялись при организации нашего подхода к автотестам:

[Паттерны проектирования в автоматизации тестирования](https://habr.com/ru/companies/jugru/articles/338836/)

[BDD tests](https://www.clearlyagile.com/agile-blog/real-world-example-of-bdd-behavior-driven-development-agile-engineering-practices)

### Плагины
* autoLogin - для исключения необходимости перелогиниваться заново - сессия с куками лежит в папке output - там же находятся снепшоты ошибок.
* allure - для визуализации результатов выполнения тестов. Начиная с версии [3.4.0]('https://codecept.io/changelog/#_3-4-0') вынесен в отдельный пакет и устанавливается отдельно. Так же для его работы необходима библиотека [allure-commandline]('https://www.npmjs.com/package/allure-commandline'). Выгрузка отчета работает автоматически при каждой выкатке проекта. Папка выгрузки - output/allure
