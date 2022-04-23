import * as  React from 'react';
import fetchData from '../../utils/fetchData';
import Table from '../../components/Table/Table';
import {BlockToast} from "../../components/BlockToast";
import {Page} from "../../components/Page";
import {Panel} from "../../components/Panel";
import {Row} from "../../components/Row";
import {AVG_BUY, AVG_SELL, GROSS_PROFIT, PROFIT_MARGINS, Q_BUY, Q_SELL, TYPE_NAME} from "./TradingTableHeaders";
import {IGroupedTXRecord} from "../../../backend/domains/reports/data/ReportsDAL";
import postData from "../../utils/postData";

interface IState {
  reportData: IGroupedTXRecord[];
  minIskFilter: number;
  selectedMonth: number;
  selectedYear: number;
  selectAllYear: number;
}

class Trading extends React.Component<any, IState> {
  constructor(props: Record<string, any>) {
    super(props);
    this.state = {
      selectAllYear: 0,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      reportData: null,
      minIskFilter: 1 // in millions
    };
  }

  async hydrateTableData() {
    const {data} = await postData<IGroupedTXRecord[]>('auth/reports', {
      month: this.state.selectedMonth,
      year: this.state.selectedYear,
      allYear: this.state.selectAllYear,
      minGrossProfit: 1
    });

    data.sort((a, b) => {
      return b.grossProfit - a.grossProfit
    });

    // collect all available data

    this.setState({
      reportData: data
    });
  }

  async componentDidMount() {
    await this.hydrateTableData();
  }

  render() {
    if (!this.state.reportData) {
      return <BlockToast/>;
    }

    return (
      <Page title="Trade">
        <Row>
          <Panel columns={10} title={'Trading summary - Bought and sold items'}>
            <div>* Gross Profit calculation: min(bought, sold) * avgProfit</div>
            <div>** Profit margins calculation: avgProfit / avgBuy</div>
            <div>*** This table excludes items that were not traded (sold AND bought) during the period.</div>
            <br/>
            <div>
              <label>Year:&nbsp;&nbsp;</label>
              <select
                value={this.state.selectedYear}
                onChange={(e) => {
                  this.setState({
                    selectedYear: +e.target.value
                  }, () => {
                    this.hydrateTableData();
                  });
                }}
              >
                {
                  [new Date().getFullYear() + 1, new Date().getFullYear(), new Date().getFullYear() - 1].map((year) => {
                    return <option
                      key={year}
                    >{year}</option>
                  })
                }

              </select>
            </div>

            <div>
              <label>Month:&nbsp;&nbsp;</label>
              <select
                disabled={!!this.state.selectAllYear}
                defaultValue={this.state.selectedMonth}
                onChange={(e) => {
                  this.setState({
                    selectedMonth: +e.target.value
                  }, () => {
                    this.hydrateTableData();
                  });
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                  return <option
                    key={month}
                  >{month}</option>
                })}
              </select>
              &nbsp;
              <label>
                All year?
              </label>
              <input type='checkbox' onChange={(e) => {
                this.setState({
                  selectAllYear: e.target.checked ? 1 : 0
                }, () => {
                  this.hydrateTableData();
                })
              }}/>
            </div>

            <Table
              columns={[TYPE_NAME, Q_BUY, Q_SELL, AVG_BUY, AVG_SELL, GROSS_PROFIT, PROFIT_MARGINS]}
              data={this.state.reportData}
            />
          </Panel>
        </Row>

      </Page>
    )
  }
}

export default Trading;