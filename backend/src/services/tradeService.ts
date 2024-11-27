import Partner from '../models/Partner';
import TradeData from '../models/TradeData';

export const saveTradeData = async (data: any) => {
  try {
    await TradeData.bulkCreate(
      data.map((item: any) => ({
        typeCode: item.typeCode,
        freqCode: item.freqCode,
        refPeriodId: item.refPeriodId,
        refYear: item.refYear,
        refMonth: item.refMonth,
        period: item.period,
        reporterCode: item.reporterCode,
        reporterISO: item.reporterISO,
        reporterDesc: item.reporterDesc,
        flowCode: item.flowCode,
        flowDesc: item.flowDesc,
        partnerCode: item.partnerCode,
        partnerISO: item.partnerISO,
        partnerDesc: item.partnerDesc,
        partner2Code: item.partner2Code,
        partner2ISO: item.partner2ISO,
        partner2Desc: item.partner2Desc,
        classificationCode: item.classificationCode,
        classificationSearchCode: item.classificationSearchCode,
        isOriginalClassification: item.isOriginalClassification,
        cmdCode: item.cmdCode,
        cmdDesc: item.cmdDesc,
        aggrLevel: item.aggrLevel,
        isLeaf: item.isLeaf,
        customsCode: item.customsCode,
        customsDesc: item.customsDesc,
        mosCode: item.mosCode,
        motCode: item.motCode,
        motDesc: item.motDesc,
        qtyUnitCode: item.qtyUnitCode,
        qtyUnitAbbr: item.qtyUnitAbbr,
        qty: item.qty,
        isQtyEstimated: item.isQtyEstimated,
        altQtyUnitCode: item.altQtyUnitCode,
        altQtyUnitAbbr: item.altQtyUnitAbbr,
        altQty: item.altQty,
        isAltQtyEstimated: item.isAltQtyEstimated,
        netWgt: item.netWgt,
        isNetWgtEstimated: item.isNetWgtEstimated,
        grossWgt: item.grossWgt,
        isGrossWgtEstimated: item.isGrossWgtEstimated,
        cifvalue: item.cifvalue,
        fobvalue: item.fobvalue,
        primaryValue: item.primaryValue,
        legacyEstimationFlag: item.legacyEstimationFlag,
        isReported: item.isReported,
        isAggregate: item.isAggregate,
      })),
      {
        validate: true, // Performs validation before inserting
        individualHooks: false, // Disables individual hooks for each item if you don't need them
        returning: false, // If you don't need the data returned
      },
    );

    console.log('Trade data saved successfully!');
  } catch (error) {
    console.error('Error saving trade data:', error);
  }
};

export const savePartnerData = async (partners: any[]) => {
  for (const partner of partners) {
    try {
      const {
        text,
        PartnerCode,
        PartnerDesc,
        PartnerCodeIsoAlpha2,
        PartnerCodeIsoAlpha3,
        entryEffectiveDate,
        entryExpiredDate,
        isGroup,
        partnerNote,
      } = partner;
      console.log('\n\nDATA:', partner);

      // Check if the Partner already exists in the database, and if so, update it
      const existingPartner = await Partner.findOne({ where: { PartnerCode } });

      if (existingPartner) {
        await existingPartner.update({
          text,
          PartnerCode,
          PartnerDesc,
          PartnerCodeIsoAlpha2,
          PartnerCodeIsoAlpha3,
          entryEffectiveDate,
          entryExpiredDate,
          isGroup,
          partnerNote,
        });
      } else {
        await Partner.create({
          text,
          PartnerCode,
          PartnerDesc,
          PartnerCodeIsoAlpha2,
          PartnerCodeIsoAlpha3,
          entryEffectiveDate,
          entryExpiredDate,
          isGroup,
          partnerNote,
        });
      }
    } catch (error) {
      console.error('Error saving partner data:', error);
    }
  }
};
