let $ = require ('jquery')

import  {Container} from '../view.js'

describe("create container", function() {

  it("создает контейнер для слайдера", function() {
    assert.equal(new Container().createContainer(),true);
  });

});

mocha.run();