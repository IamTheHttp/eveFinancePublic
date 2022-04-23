import {mount} from "enzyme";
import {OpenQuotasTable} from "../../../views/Quotas/components/QuotasList/ui/OpenQuotasTable";
import React from "react";
import {SIQuota} from "../../../views/Quotas/components/QuotasList/QuotasList";
import {
  calcLeftToBuild,
  calcMissingBpcAfterResearch, calcMissingBpcInStock
} from "../../../views/Quotas/components/QuotasList/QuotaTableHeaders";

function createItem(data: Partial<SIQuota> = {}) {
  return Object.assign({}, {
    icon: 'path/to/icon',
    isOpen: true,
    typeID: 23919,
    typeName: 'Some Item',
    amount: 10,
    completionDate: false,
    createdDate: new Date(),
    quotaID: '1234',
    availableBPCRuns: 10,
    availableBPCRunsNet: 0,
    bpcRunsInProgress: 0,
    bpoCount: 0,
    newBpcInProgress: 0,
    runsDoneAndInProgress: 0,
    runsInProgress: 0,
    runsSuccessful: 0
  }, data);
}

describe('Testing Quotas List', () => {
  it('Render an empty list', () => {
    const wrapper = mount(
      <OpenQuotasTable
        inProgressQuotas={[]}
        updateQuotasData={() => {

        }}
      />
    );

    expect(wrapper.html()).toBe("");
  });

  it('Render a list with one item and not enough BPC (no bpo)', () => {
    const wrapper = mount(
      <OpenQuotasTable
        inProgressQuotas={[createItem({
          amount: 100,
          availableBPCRuns: 0
        })]}
        updateQuotasData={() => {

        }}
      />
    );

    expect(wrapper.find('.enough-bpc--error').length).toBe(1);
  });

  it('Render a list with one item, no bpc but a bpo', () => {
    const wrapper = mount(
      <OpenQuotasTable
        inProgressQuotas={[createItem({
          amount: 100,
          availableBPCRuns: 0,
          bpoCount: 1
        })]}
        updateQuotasData={() => {

        }}
      />
    );

    expect(wrapper.find('.enough-bpc--error').length).toBe(0);
  });

  it('Render a list with one item, enough bpc', () => {
    const wrapper = mount(
      <OpenQuotasTable
        inProgressQuotas={[createItem({
          amount: 100,
          availableBPCRuns: 2000,
          availableBPCRunsNet: 2000,
          bpcRunsInProgress: 2000,
        })]}
        updateQuotasData={() => {

        }}
      />
    );

    expect(wrapper.find('.enough-bpc--error').length).toBe(0);
  });


  it('An item with not enough stock, but enough in production', () => {
    const wrapper = mount(
      <OpenQuotasTable
        inProgressQuotas={[createItem({
          amount: 100, // amount to produce
          availableBPCRuns: 0,
          availableBPCRunsNet: 0,
          bpcRunsInProgress: 2000,
        })]}
        updateQuotasData={() => {

        }}
      />
    );

    expect(wrapper.find('.enough-bpc--warn').length).toBe(0);
  });

  it ('Should not be red', () => {
    const item = createItem({
      amount: 1000,
      availableBPCRuns: 910,
      availableBPCRunsNet: 910,
      bpcRunsInProgress: 0,
      newBpcInProgress: 975.7999956607819,
      runsDoneAndInProgress: 0,
      runsInProgress: 0,
      runsSuccessful: 0,
    });

    const wrapper = mount(
      <OpenQuotasTable
        inProgressQuotas={[item]}
        updateQuotasData={() => {

        }}
      />
    );

    expect(calcLeftToBuild(item)).toBe(1000);
    expect(calcMissingBpcInStock(item)).toBe(90);
    expect(Math.round(calcMissingBpcAfterResearch(item))).toBe(-886);

    expect(wrapper.find('.enough-bpc--error').length).toBe(0);
  });
})