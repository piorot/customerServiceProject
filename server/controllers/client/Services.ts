import { IServices } from "../../types/types";
import TimeHandler from "../../utils/timeHandler";
import ClientModel from "../../models/clientModel";
import { Request, Response } from "express";
import moment from "moment-timezone";
export default class Services {
  public async clientServiceUpdate(req: Request, res: Response) {
    const { id } = req.body;
    const { filtered } = req.body;
    filtered.forEach((i: IServices) => {
      new TimeHandler().timeChecker(i);
      delete i.createdDate;
      delete i.__v;
      return i;
    });
    try {
      await ClientModel.updateOne({ _id: id }, { $addToSet: { typeOfService: filtered } });
      const updateClientData = await ClientModel.find();
      res.status(200).json(updateClientData);
    } catch (e) {
      res.status(400).json("Something went wrong");
    }
  }
  public async extendService(req: Request, res: Response) {
    const { clientID, serviceID, value } = req.body;
    try {
      const doc: any = await ClientModel.findOne({ _id: clientID });
      const find = doc.typeOfService.find((i: any) => i.id === serviceID);
      const time = moment(find.finishTime)
        .add(value, "months")
        .format();
      find.finishTime = time;
      find.extendTimes += 1;
      await doc.save();
      const data = await ClientModel.find();
      res.status(200).json(data);
    } catch (e) {
      return res.status(400).json("Error");
    }
  }
  public async closeService(req: Request, res: Response) {
    const { userid, serviceid } = req.query;
    // Note: pushing object with the same id might cause an error, when items will be map!
    try {
      const client: any = await ClientModel.findOne({ _id: userid });
      const service = client.typeOfService.find((i: any) => i.id === serviceid);
      service.closed = moment().format();
      service.active = false;
      client.servicesHistory.push(service);
      client.typeOfService = client.typeOfService.filter((i: any) => i.id !== serviceid);
      await client.save();
      const data = await ClientModel.find();
      res.status(200).json(data);
    } catch (e) {
      res.status(400).json("Something went wrong");
    }
  }
}