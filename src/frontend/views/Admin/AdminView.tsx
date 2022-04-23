import {Page} from "../../components/Page";
import * as React from "react";
import {Row} from "../../components/Row";
import {Panel} from "../../components/Panel";
import {AddLicense} from "./components/AddLicense/AddLicense";
import {ListLicenses} from "./components/ListLicenses/ListLicenses";
import {LicenseLogsView} from "./components/LicenseLogsView/LicenseLogsView";

function AdminView() {
  return (
    <Page title={`Admin`}>
      <Row>
        <Panel columns={4} title='Add License'>
          <AddLicense/>
        </Panel>

        <Panel columns={8} title='Available Licenses'>
          <ListLicenses/>
        </Panel>
      </Row>
      <Row>
        <Panel columns={12} title='License Purchases'>
          <LicenseLogsView/>
        </Panel>
      </Row>
    </Page>
  )
}


export {AdminView}