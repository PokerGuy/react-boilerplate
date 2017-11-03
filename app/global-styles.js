import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }
  
  .centered {
    text-align: center;
  }  

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  
  .green {
    background-color: green;
  }
  
  .yellow {
    background-color: yellow; 
  }
  
  .red {
    background-color: red;
  }
  
  .select-row {
    width: 100%;
    display: flex;
    align-items: center;
  }
  
  .selected {
    border-radius: 15px 50px 30px;
    background: black
    font-weight: bold;
    color: white;
    text-align: center,
    padding: 20px; 
    display: block;
  }
  
  .not-select {
    text-align: center,
    padding: 20px;
    display: block;
  }
  
  tr.separating_line {
    border-top: 1px #000 solid; /* top border only */
  }
`;
