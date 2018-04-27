# 鋤DEE A/B 網上對戰 Server (by [Coke_Zero](http://colloque.io/))

[Live Demo](https://dee.colloque.io/)

Client source: https://github.com/colloquet/big2-server

## Setup

``` bash
# define reCAPTCHA site key and secret key in .env.sample and rename to .env
# you can get API keys here: http://www.google.com/recaptcha/admin
RECAPTCHA_SITE_KEY=XXX
RECAPTCHA_SECRET_KEY=XXX

# install dependencies
npm install

# start development server
npm start

# start production server using PM2
npm run production

# test big2 rules engine
npm run test
```

## License

MIT License

Copyright (c) 2018 Colloque Tsui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.