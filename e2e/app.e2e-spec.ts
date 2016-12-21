import { AnontownClientPage } from './app.po';

describe('anontown-client App', function() {
  let page: AnontownClientPage;

  beforeEach(() => {
    page = new AnontownClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
