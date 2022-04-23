import * as  React from 'react';
import fetchData from '../../utils/fetchData';
import Table from '../../components/Table/Table';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart} from 'recharts';
import {BlockToast} from "../../components/BlockToast";
import {Page} from "../../components/Page";
import {Panel} from "../../components/Panel";
import {Row} from "../../components/Row";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../components/IsLoggedIn";
import {IColumn} from "../../components/Table/interfaces";

interface ITradingVolume {

}


function Finance() {
  const [walletBalance, setWalletBalance] = useState<any>(0)
  const [marketOrders, setMarketOrders] = useState<any>([])
  const [tradingVolume, setTradingVolume] = useState<any>([])
  const [weeklyJournalByType, setWeeklyJournalByType] = useState<any>([])

  const {isLoggedIn, charID, corporationName, corporationBalanceByDivision } = useContext(UserContext);

  const corpWalletDivisions = corporationBalanceByDivision.map((wallet) => {
    return {
      corpName: corporationName,
      walletBalance: wallet.balance,
      division: wallet.division
    }
  })



  useEffect(() => {
    (async () => {
      const newWalletBalance = await fetchData('auth/walletBalance');
      const newMarketOrders = await fetchData('auth/marketOrders');
      const newTradingVolume = await fetchData<ITradingVolume[]>('auth/weeklyTradingVolume');
      const newWeeklyJournalByType = await fetchData('auth/weeklyJournalByType');
      const MIL = 1000000;
      const scale = (val: any) => {
        return Math.round(val / MIL);
      };

      const scaledTradingVolume = newTradingVolume.data.map((item: any) => {
        return {
          netTrading: scale(item.sellVolume - item.buyVolume),
          sellVolume: scale(item.sellVolume),
          buyVolume: scale(item.buyVolume),
          _id: item._id
        }
      });

      setWalletBalance(newWalletBalance.data)
      setMarketOrders(newMarketOrders.data)
      setWeeklyJournalByType(newWeeklyJournalByType.data)
      setTradingVolume(scaledTradingVolume)
    })();
  }, []);


  if (!walletBalance) {
    return <BlockToast/>;
  }

  let sumMarket = 0;
  marketOrders.forEach((charMarketSummary: any) => {
    sumMarket += charMarketSummary.sumBuyOrders + charMarketSummary.sumSellOrders;
  });

  let sumISK = (sumMarket + walletBalance.total).toLocaleString();
  // Array of {_id: weekNumber, data: [{transferType, amount}]}


  type weeklyJournalItem = {
    _id: string,
    data: { amount: number, transferType: string }[]
  };

  let allTransferTypes: string[] = [];
  let allWeeksMap: Record<string, any> = {};


  let myArr: any[] = [];

  let weekHeaders: IColumn[] = [{
    name:'transferType',
    getClassName: () => {
      return 'transfer-type'
    },
    calcColumnValue : (row) => {
      return row.transferType;
    }
  }];

  weeklyJournalByType.forEach((item: weeklyJournalItem) => {
    weekHeaders.push({
      name: item._id,
      getClassName: (row) => {
        if (row[item._id] > 0) {
          return 'isk-positive-cell'
        }

        if (row[item._id] < 0) {
          return 'isk-negative-cell'
        }

        if (row[item._id] === 0) {
          return 'isk-neutral-cell'
        }
      },
      calcColumnValue: (row) => {
        return row[item._id] || 0
      }
    });
    myArr.push(...item.data.map((dt) => {
      if (item._id) {
        return {...dt, week: item._id};
      } else {
        return false;
      }
    }).filter(a => a));
  });

  // I want an array of {transferType:'', week1:0, week2: 0, week3 :0}
  let journalSummaryTable: any[] = [];
  myArr.forEach((item) => {
    let foundRow = journalSummaryTable.find((existingRow) => {
      return existingRow.transferType === item.transferType;
    });

    // Do i have this row? if i
    if (foundRow /* if row exists... */) {
      foundRow[item.week] = Math.round(item.amount);
    } else {
      journalSummaryTable.push({
        transferType: item.transferType,
        [item.week]: Math.round(item.amount)
      })
    }
  });

  journalSummaryTable = journalSummaryTable.sort(function(a, b){
    if(a.transferType < b.transferType) { return -1; }
    if(a.transferType > b.transferType) { return 1; }
    return 0;
  }).map((a) => {
    return {
      ...a,
      transferType: a.transferType.replace(/_/g, ' ')
    }
  });

  return (
    <Page title={`Finance`}>
      <Row>
        <Panel title='ISK breakdown' columns={6}>
          <Row>
            <Panel columns={12}>
              <h1 className='number'>Sum - {sumISK}</h1>
            </Panel>
          </Row>
          <Row>
            <Panel columns={6} title='Characters'>
              <Table
                HideColumnTitles={true}
                columns={Object.keys(walletBalance.charWallets[0])}
                data={walletBalance.charWallets}
              />
            </Panel>

            <Panel columns={6} title='Corporations'>
              <Table
                HideColumnTitles={true}
                columns={['corpName', 'division', 'walletBalance']}
                data={corpWalletDivisions}
              />
            </Panel>
          </Row>
          <Row>
            <Panel columns={6} title='Sell Orders'>
              <Table
                HideColumnTitles={true}
                columns={['charName', 'sumSellOrders']}
                data={marketOrders}
              />
            </Panel>
            <Panel columns={6} title='Buy Orders'>
              <Table
                HideColumnTitles={true}
                columns={['charName', 'sumBuyOrders']}
                data={marketOrders}
              />
            </Panel>
          </Row>
        </Panel>


        <Panel title='Cash flow' columns={6}>
          <Table
            columns={weekHeaders}
            data={journalSummaryTable}
          />
        </Panel>

        <Panel columns={12} id='finance-bar-char-wrapper'>
          {/* screen.width can be replaced with useEffect probably */}
          <BarChart width={window.screen.width * 0.6} height={300} data={tradingVolume}>
            <CartesianGrid stroke="#ffffff50" strokeDasharray="15 2"/>
            <XAxis dataKey="_id"/>
            <YAxis label={{
              value: 'Net Trading in Millions of ISK',
              className: "chartLabel",
              angle: -90,
              position: 'insideBottomLeft'
            }}/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="sellVolume" fill="#154714"/>
            <Bar dataKey="buyVolume" fill="#840000"/>
          </BarChart>
        </Panel>
      </Row>
    </Page>
  );
}

export {Finance};