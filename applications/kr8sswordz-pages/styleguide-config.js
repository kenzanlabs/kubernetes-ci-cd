const styleguide = require('sc5-styleguide/lib/modules/cli/styleguide-cli');
const async = require('async');
const {ncp} = require('ncp');

const config = {
  title: 'Styleguide',
  sideNav: true,
  overviewPath: 'src/styles/STYLEGUIDE.md',
  commonClass: 'sg-common',
  kssSource: 'src/**/*.scss',
  styleSource: 'dist/style.css',
  output: 'styleguide',
  watch: true,
  server: true,
  hideSubsectionsOnMainSection: true,
  disableEncapsulation: true
};

async.series([
  (done) => {
    styleguide({
      overviewPath: 'src/styles/STYLEGUIDE.md',
      kssSource: 'src/**/*.scss',
      styleSource: 'dist/style.css',
      output: 'styleguide',
      watch: false,
      server: false
    });
    done();
  },
  (done) => {
    ncp('src/assets', 'styleguide/assets', (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Assets copied to styleguide');
      done();
    });
  },
  () => {
    styleguide(config);
  }
]);
