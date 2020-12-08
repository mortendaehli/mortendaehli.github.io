
import { createGlobalStyle } from 'styled-components'
// import reset from 'styled-reset-advanced';
import theme from './index';

// fonts

import hl from '../fonts/hl.woff';
import hl2 from '../fonts/hl.woff2';
import hm from '../fonts/hm.woff';
import hm2 from '../fonts/hm.woff2';
import hb from '../fonts/hb.woff';
import hb2 from '../fonts/hb.woff2';

import ld from '../fonts/LouizeDisplaytrial.woff';
import ld2 from '../fonts/LouizeDisplaytrial.woff2';

// ${reset}

const GlobalStyle = createGlobalStyle`

  * {
    user-select: auto !important;
  }

  html {
    box-sizing: border-box;
    scroll-behavior: smooth;
    background-color: ${theme.darkgrey};
    color: #d7d7d7;
    overflow-x: hidden;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
      -webkit-box-shadow: none;
      background-color: transparent;
      border-radius: 0px;
  }

  ::-webkit-scrollbar-thumb {
      border-radius: 0px;
      -webkit-box-shadow: none;
      background-color: #b4a892;
  }

  body {
    background-color: ${theme.darkgrey};
    min-height: 100vh;
    overflow-x: hidden;
    cursor: url("data:image/svg+xml,%0A%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Ccircle id='Cerce' fill='%23333333' cx='4' cy='4' r='4'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E"), pointer;
  }

  a {
    cursor: url("data:image/svg+xml,%0A%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Ccircle id='Cerce' fill='%23C7C5C1' cx='4' cy='4' r='4'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E"), pointer;
  }

  @font-face {
    font-family: 'hl';
    src: url(${hl2}) format('woff2'),
        url(${hl}) format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'ld';
    src: url(${ld2}) format('woff2'),
        url(${ld}) format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'hm';
    src: url(${hm2}) format('woff2'),
        url(${hm}) format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'hb';
    src: url(${hb2}) format('woff2'),
        url(${hb}) format('woff');
    font-weight: normal;
    font-style: normal;
  }

  main {
    transition: all 0.25s ease-in-out;
  }

  h1 {
    font-size: 46px;
    line-height: 140%;
    letter-spacing: 0.02em;
    font-family: 'hl';
    color: ${theme.headline_color};
    @media (max-width: 768px) {
      font-size: 34px;
      line-height: 45px;
      letter-spacing: 0.02em;
    }
  }

  h2 {
    font-family: 'hl';
    font-size: 34px;
    letter-spacing: 0.02em;
    line-height: 45px;
    color: ${theme.headline_color};
  }

  h3 {
    font-family: 'hl';
    font-size: 28px;
    line-height: 42px;
    letter-spacing: 0.02em;
    color: ${theme.text_color};
    sup {
      font-size: 14px;
      line-height: 24px;
    }
  }

  h4 {
    font-family: 'hm';
    font-size: 24px;
    line-height: 31px;
    letter-spacing: 0.02em;
    color: ${theme.text_color};
    @media (max-width: 768px) {
      font-size: 18px;
      line-height: 174%;
    }
  }

  h5 {
    font-family: 'hm';
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.01em;
    color: ${theme.text_color};
  }

  h6 {
    font-family: 'hl';
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${theme.text_color};
  }

  p {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 18px;
    line-height: 174%;
    letter-spacing: 0.02em;
    color: ${theme.text_color};
  }

  p+p {
    margin-top: 18px;
  }

  ul {
    list-style-type: disc;
    padding-left: 30px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  li {
    margin-left: 20px;
    font-family: 'hl';
    font-size: 18px;
    line-height: 174%;
    letter-spacing: 0.02em;
    color: ${theme.text_color};
  }
`

export default GlobalStyle;

