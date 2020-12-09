const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');
const pluralize = require('pluralize');
const fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('modelName', { type: String, required: true });
    this.props = {
      modelName: this.options.modelName,
      modelNamePlural: pluralize(this.options.modelName),
    };
  }

  writing() {
    try{
      this.fs.copyTpl(
        this.templatePath('./views/pages/api/model'),
        this.destinationPath(`app/views/pages/api/${this.props.modelNamePlural}`),
        this.props
      )
    } catch (e) {
      console.error(e);
    }
  }

  install() {
  }

  end() {
    console.log(chalk.green('REST api endpoints generated'));
  }
};
