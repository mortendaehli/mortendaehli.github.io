import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const Wiggle = keyframes`
  0% { transform: rotate(4deg); }
  50% { transform: rotate(-4deg); }
  100% { transform: rotate(4deg); }
`;

const Hand = styled.span`
  display: inline-block;
  &:hover {
    animation-name: ${Wiggle};
    animation-duration: 0.5s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 3;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
`

const Div = styled.section`
  display: flex;
  justify-content: center;
  min-height: 70vh;
  align-items: flex-start;
  flex-direction: column;
  max-width: 670px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  @media (max-width: 768px) {
    min-height: 0;
    padding-top: 40px;
    padding-bottom: 40px;
  }
  p {
    text-align: center;
    color: ${props => props.theme.h3_color};
    margin-top: 20px;
    span {
      white-space: nowrap;
    }
  }
  sup {
    font-size: 24px;
  }
  &:hover {
    ${Hand} {
      animation-name: ${Wiggle};
      animation-duration: 0.5s;
      animation-timing-function: ease;
      animation-delay: 0s;
      animation-iteration-count: 3;
      animation-direction: normal;
      animation-fill-mode: forwards;
      animation-play-state: running;
    }
  }
  h2 {
    margin-bottom: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 768px) {
      padding-left: 20px;
      text-align: left;
      margin-left: 0px;
    }
  }
  p {
    padding-left: 0px;
    padding-right: 0px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    text-align: center;
    @media (max-width: 768px) {
      padding-left: 20px;
      padding-right: 20px;
      text-align: left;
      margin-left: 0px;
    }
    a {
      text-decoration: none;
      color: #999;
      transition: all 0.25s ease-in-out;
      display: inline-block;
      &:after {
        content: '';
        display: block;
        width: 0;
        height: 1px;
        background: #999;
        transition: width .3s;
      }
      &:hover {
        color: #C7C5C1;
        &:after {
          width: 100%;
        }
      }
    }
  }
`

class Home extends Component {
    render() {
        return (
            <section className="hero is-fullheight has-bg-img">

                <div className="hero-body">s
                    <div className="container">
                        <section className="hero-text">
                            <h2 className="hero-h2">
                                Hi, I'm Morten Dæhli Aslesen
                                <span role="img" aria-label="waving hand">👋</span>
                            </h2>
                            <p className="">
                                I am an AI and data engineer working as a consultant for Bouvet. Powered by an endless curiosity I explore every part of the tech universe and I'm always looking into something new.
                            </p>
                            <p className="">
                                Got any questions? <a href="mailto:post@daehli.no">Contact me.</a>
                            </p>
                        </section>
                        <h1 className="title is-large"> </h1>
                        <h2 className="subtitle is-siez-5">

                        </h2>
                    </div>
                </div>
            </section>
        )
    }
}
export default Home;