import * as React from 'react';
import {Panel} from "../../components/Panel";
import {Page} from "../../components/Page";
import {Row} from "../../components/Row";
import CharactersList from "./components/CharactersList";

function CharactersView() {

  return (
    <Page title={`Admin/Characters`}>
      <Row>
        <Panel columns={12} title='Characters'>
          <CharactersList/>
        </Panel>
      </Row>
    </Page>
  )
}


export {CharactersView}