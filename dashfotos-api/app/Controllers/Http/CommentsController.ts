import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Dashfoto from 'App/Models/Dashfoto'


export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const dashfotoId = params.dashfotoId

    await Dashfoto.findOrFail(dashfotoId)

    body.dashfotoId = dashfotoId

    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: 'Comentário adicionado com sucesso!',
      data: comment,
    }
  }
}
