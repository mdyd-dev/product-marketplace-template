const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');
const pluralize = require('pluralize');
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('modelName', { type: String, required: true });
    this.argument('attributes', { type: Array, required: true });

    const attributes = this.options.attributes.map((attr) => {
      const values = attr.split(':');
      return { name: values[0], type: values[1] };
    });
    this.props = {
      modelName: this.options.modelName,
      modelNamePlural: pluralize(this.options.modelName),
      attributes: attributes
    };
  }

  writing() {
    try{
      const tmpTranslationPath = this.templatePath(`./translations/${this.props.modelNamePlural}.yml`);
      this.fs.copyTpl(
        this.templatePath('./translations/model.yml'),
        tmpTranslationPath,
        this.props
      );
      setTimeout(() => {
        const templateTranslation = yaml.safeLoad(fs.readFileSync(tmpTranslationPath, 'utf8'));
        const destinationTranslationPath = this.destinationPath('app/translations/en.yml');
        const destinationTranslation = yaml.safeLoad(fs.readFileSync(destinationTranslationPath, 'utf8'));

        destinationTranslation.en.app.models[this.props.modelNamePlural] = templateTranslation.model;
        fs.writeFileSync(destinationTranslationPath, yaml.safeDump(destinationTranslation));
        this.fs.delete(tmpTranslationPath);
      }, 100);

      this.fs.copyTpl(
        this.templatePath('./model_schemas/model.yml'),
        this.destinationPath(`app/model_schemas/${this.props.modelName}.yml`),
        this.props
      )
      this.fs.copyTpl(
        this.templatePath('./graphql/*.graphql'),
        this.destinationPath(`app/graphql/${this.props.modelNamePlural}/`),
        this.props
      )
      this.fs.copyTpl(
        this.templatePath('./views/partials/lib/data/queries/model'),
        this.destinationPath(`app/views/partials/lib/data/queries/${this.props.modelNamePlural}`),
        this.props
      )
      this.fs.copyTpl(
        this.templatePath('./views/partials/lib/commands/model'),
        this.destinationPath(`app/views/partials/lib/commands/${this.props.modelNamePlural}`),
        this.props
      )
      this.fs.copyTpl(
        this.templatePath('./views/pages/model'),
        this.destinationPath(`app/views/pages/${this.props.modelNamePlural}`),
        this.props
      )
      this.fs.copyTpl(
        this.templatePath('./views/partials/theme/simple/model'),
        this.destinationPath(`app/views/partials/theme/simple/${this.props.modelNamePlural}`),
        this.props
      )
    } catch (e) {
      console.error(e);
    }
  }

  install() {
    // process.chdir(`${this.contextRoot}/${this.props.projectDir}`);
  }

  end() {
    console.log(chalk.green('CRUD generated'));
  }
};
