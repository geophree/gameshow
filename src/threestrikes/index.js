import { html } from "htm/react";

export default () => html`
  <div class="threestrikes">
    <div class="container-fluid">
      <div class="gameTitle">
        <span data-gameTitle="3 Strikes">3 Strikes</span>
      </div>
      <div class="gameBoard">
        <div class="screen">
          <div class="numScreen blink" id="dollar">$</div>
        </div>
        <div class="screen">
          <div class="numScreen blink" id="0">1</div>
        </div>
        <div class="screen">
          <div class="numScreen blink" id="1">2</div>
        </div>
        <div class="screen">
          <div class="numScreen blink" id="2">3</div>
        </div>
        <div class="screen">
          <div class="numScreen blink" id="3">4</div>
        </div>
        <div class="screen">
          <div class="numScreen blink" id="4">5</div>
        </div>
      </div>
      <div class="base">
        <div class="strike" id="strike1"></div>
        <div class="strike" id="strike2"></div>
        <div class="strike" id="strike3"></div>
        <div class="slot"></div>
        <div class="bottom"></div>
      </div>
      <div class="bottomDiv">
        <div class="text">Come on down!</div>
        <div class="bag">
          <button class="button">
            <p>Pick</p>
            <p>Token</p>
          </button>
          <div class="token numToken" id="token0"></div>
          <div class="token numToken" id="token1"></div>
          <div class="token numToken" id="token2"></div>
          <div class="token numToken" id="token3"></div>
          <div class="token numToken" id="token4"></div>
          <div class="token strikeToken" id="token5">X</div>
          <div class="token strikeToken" id="token6">X</div>
          <div class="token strikeToken" id="token7">X</div>
        </div>
        <div class="car">
          <div class="curtain">Prize</div>
        </div>
      </div>
      <footer>
        <div id="author">© Jarrod Yellets | 2018</div>
      </footer>
    </div>
  </div>
`;
