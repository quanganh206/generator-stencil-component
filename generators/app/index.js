'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('appname', { type: String, required: true });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the incredible ${chalk.red('generator-stencil-component')} generator!`)
    );

    const prompts = [
      // {
      //   type: 'input',
      //   name: 'name',
      //   message: 'Enter a name for the new component (i.e.: page-home): '
      // },
      {
        type: 'input',
        name: 'folder',
        message: 'Please specify path (src/components/+path): ',
        default: 'src/components/'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      // this.props.name = props.name.toString().trim();
      this.props.name = this.options.appname.toString().trim();
      this.props.folder = props.folder.toString().trim();
    });
  }

  writing() {
    let componentName = '';

    if (this.props.name.indexOf('-') > 0) {
      let names = this.props.name.split('-');
      for (var i = 0; i < names.length; i++) {
        const name = names[i].charAt(0).toUpperCase() + names[i].substr(1).toLowerCase();
        componentName += name;
      }
    } else {
      componentName = this.props.name;
    }

    if (this.props.folder === 'src/components/') {
      this.destinationRoot(this.props.folder + this.props.name);
    } else {
      if (this.props.folder.charAt(0) === '/') {
        this.props.folder = this.props.folder.substr(1);
      }
      if (this.props.folder.charAt(this.props.folder.length - 1) !== '/') {
        this.props.folder += '/';
      }
      this.destinationRoot('src/components/' + this.props.folder + this.props.name);
    }

    this.fs.copyTpl(
      this.templatePath('component.txt'),
      this.destinationPath(this.props.name + '.tsx'), {
        name: this.props.name,
        component: componentName
      }
    );

    this.fs.copyTpl(
      this.templatePath('style.txt'),
      this.destinationPath(this.props.name + '.scss'), {
        name: this.props.name
      }
    );
  }

  install() {
    // this.installDependencies();
  }
};
