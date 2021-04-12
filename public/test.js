export default {
  'It should have a video element': (browser) => {
    const path = '/src/content/getusermedia/gum/index.html';
    const url = 'file://' + process.cwd() + path;

    browser.url(url)
        .waitForElementVisible('button#showVideo', 1000)
        .click('button#showVideo')
        .waitForElementVisible('video')
        .waitForMediaPlaybackReady('video', 5000)
        .end();
  }
};