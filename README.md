# Playbook demo app
When integrating Waylay rules engine into your automation scenario, you can imagine different ways to start a task:

* by executing the API call in your application to start a task
* by associating a template to a particular resource type, in which case Waylay will automatically handle rules execution life cycle
* creating the UI on your side to instantiate the template.

In the latter case, it is well possible that some of the input arguments to run a task might come from another database or application, in which case, relying on the meta store of Waylay is not possible. In order to avoid hard coding in your application which exactly input arguments are needed for which template (such as an email address for one specific sensor), Waylay template comes with a concept of variables, which is a JSON schema associated with a template. This allows the template creator to specify upfront which input arguments are required at runtime, making building UI applications on top very easy, as there are many form builders that work out of the box on top of JSON schemas. 
More about this feature and demo app you can find on [our documentation site](https://docs-io.waylay.io/#/videos/?id=how-to-create-a-playbook)

With this NO CODE demo app, you can learn how connect to Waylay instance and run the Playbook. Have fun!

In this repo you can also find an example how to connect to our indentity service from your application. 

## Run the application

Install dependencies
```
yarn
```
Start application 
```
yarn start
```
