import * as  React from 'react';
import {Page} from "../components/Page";
import {Panel} from "../components/Panel";
import {Row} from "../components/Row";
import {publicConfig} from "../../config/publicConfig";


function Help() {

  return (
    <Page title="Help">
      <Row>
        <Panel columns={5} title='About'>
          <p>EveFinance is a system designed to control all aspects of the financial nature of EVE Online</p>
          <p>Some key features:</p>
          <ul>
            <li>View your cash(ISK) flow month by month, and by type of ISK transaction</li>
            <li>View your sales per item over months</li>
            <li>Manage your production! you can specify how many units to produce of an item, and get the resource requirements within the system</li>
            <li>Track sell orders across systems, see immediately when a sell order is done so you can re-stock it</li>
          </ul>
          Found an issue?
          <p>You can report issues through github, found <a href={publicConfig.ISSUE_TRACKER_URL}>here</a></p>
        </Panel>
        <Panel columns={5} title=''>
          <img style={{width:'100%'}} src="https://res.cloudinary.com/iamhttp/image/upload/q_auto/f_auto/homepage"/>
        </Panel>
      </Row>

      <Row>
        <Panel columns={5} title='Getting started'>
          <ul>
            <li>Login with your character</li>
            <li>The system will start gathering your financial information</li>
            <li>You'll be able to control all your finances from a single place</li>
            <li>You can link additional characters by clicking "link" in the top menu</li>
          </ul>
        </Panel>
      </Row>

      <Row>
        <Panel columns={5} title='The Market Page'>
          <p>In this page you can set desires sell orders in various systems in EVE</p>
          <p>How to use it?</p>
          <ul>
            <li>Navigate to the Market page</li>
            <li>Select the Region and System, for example Essence, Couster</li>
            <li>Type in your item name, the match has to be exact, you'll see a check mark appear once you got it right</li>
            <li>Specify the Quantity and click "+Add"</li>
          </ul>

          <p>Once you add an item to sell in a system, you'll see on the right your stock of that item, assuming you have it in stock</p>
          <p>Your stock is calculated based on your "Stock System" - To add a Stock System, go to your account (your character on the top right, and add a stock station</p>
          <p>Before adding the stock station you'll need to add the Region, System and then finally station or structure</p>
        </Panel>

        <Panel columns={5} title='Market page screenshot'>
          <img style={{width:'100%'}} src="https://res.cloudinary.com/iamhttp/image/upload/q_auto/f_auto/market"/>
        </Panel>
      </Row>

      <Row>
        <Panel columns={5} title='The Quotas Page'>
          <p>In this page you can specify what you want to produce, and how much you already produced of that item</p>
          <p>How to use it?</p>
          <ul>
            <li>Navigate to the Quotas page</li>
            <li>Type in your item name, the match has to be exact, you'll see a check mark appear once you got it right</li>
            <li>Specify the Quantity and click "Submit"</li>
          </ul>

          You will immediately see the following information:
          <ul>
            <li>Do you need invention? - How many BPC, or BPO you have of that item</li>
            <li>How many BPC do you have in research</li>
            <li>How many BPC runs are you missing, and need inventing?</li>
          </ul>

          <p>Once you add an item to sell in a system, you'll see on the right your missing materials based on your stock of that material</p>
          <p>Your material stock is calculated based on your "Stock System" - To add a Stock System, go to your account (your character on the top right, and add a stock station</p>
          <p>Before adding the stock station you'll need to add the Region, System and then finally station or structure</p>
        </Panel>

        <Panel columns={5} title='The Quotas Page Screenshot'>
          <img style={{width:'100%'}} src="https://res.cloudinary.com/iamhttp/image/upload/q_auto/f_auto/quotas"/>
        </Panel>
      </Row>

      <Row>
        <Panel columns={5} title='Pricing'>
          <p>The system offers a 5 day trial, after which a license can be purchased using ISK</p>
          <p>Licenses include features such as Corporation tracking, linking multiple characters and more.</p>
          <p>Prices range from <b>free</b> to a few hundred million ISK per month, visit your account page to view current licenses</p>
        </Panel>
      </Row>

      <Row>
        <Panel columns={5} title='Q&A'>
          <div>
            <h4>How can I buy a license?</h4>
            <p>To buy a license you must first acquire system credits.</p>
            <p>System credits can be acquired by transferring ISK to Jenny Forsal, 1 ISK equals 1 Credit.</p>
            <p>Once you have sufficient credits, you can purchase a license from your account page (your icon on the top right).</p>
          </div>
          <div>
            <h4>How do I report issues?</h4>
            <p>You can report issues through github, found <a href={publicConfig.ISSUE_TRACKER_URL}>here</a></p>
          </div>
          <div>
            <h4>What does the error "You have too many linked characters for your license" mean</h4>
            <p>This message appears when you linked more charaters than your license supports, you can delete your extra linked characters from the account page (your icon on the top right)</p>
          </div>

          <div>
            <h4>Can I control the game from this application?</h4>
            <p>EVE Finance is designed to provide information, and cannot manipulate the EVE universe</p>
          </div>
        </Panel>
      </Row>
    </Page>
  );
}

export {Help}