import * as  React from 'react';
import fetchData from '../utils/fetchData';
import Table from '../components/Table/Table';
import {BlockToast} from "../components/BlockToast";
import {Page} from "../components/Page";
import {Panel} from "../components/Panel";
import {Row} from "../components/Row";

class Home extends React.Component<any, any> {
  state: any;

  constructor(props: Record<string, any>) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let walletBalance = await fetchData('auth/walletBalance');
    let marketOrders = await fetchData('auth/marketOrders');

    this.setState({
      walletBalance: walletBalance.data,
      marketOrders: marketOrders.data
    });
  }

  render() {
    if (!this.state.walletBalance) {
      return <BlockToast/>;
    }

    let totalWalletBalance = this.state.walletBalance.total;
    let sellAndBuyOrderSum = 0;
    this.state.marketOrders.forEach((charMarketSummary: any) => {
      sellAndBuyOrderSum += charMarketSummary.sumBuyOrders + charMarketSummary.sumSellOrders;
    });

    return (
      <Page title="Dashboard">
        <Row>
          <Panel columns={4} title="ISK balance">
            <div>
              <Table
                columns={['type', 'amount']}
                HideColumnTitles={true}
                data={[
                  {
                    type: 'wallet',
                    amount: totalWalletBalance,
                  },
                  {
                    type: 'buyAndSellOrderSum',
                    amount: sellAndBuyOrderSum
                  }
                ]}
              />
            </div>
          </Panel>
        </Row>
      </Page>
    );
  }
}

export default Home;