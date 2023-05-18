import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dashfoto from 'App/Models/Dashfoto'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

export default class DashfotosController {
  private validationOpitions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOpitions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const dashfoto = await Dashfoto.create(body)

    response.status(201)

    return {
      message: 'Postagem criada!',
      data: dashfoto,
    }
  }
  public async index() {
    const dashfotos = await Dashfoto.query().preload('comments')

    return {
      data: dashfotos,
    }
  }

  public async show({ params }: HttpContextContract) {
    const dashfoto = await Dashfoto.findOrFail(params.id)

    await dashfoto.load('comments')

    return {
      data: dashfoto,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const dashfoto = await Dashfoto.findOrFail(params.id)

    await dashfoto.delete()

    return {
      message: 'Publicação excluida!',
      data: dashfoto,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()

    const dashfoto = await Dashfoto.findOrFail(params.id)

    dashfoto.title = body.title
    dashfoto.description = body.description

    if (dashfoto.image != body.image || !dashfoto.image) {
      const image = request.file('image', this.validationOpitions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })
        dashfoto.image = imageName
      }
    }

    await dashfoto.save()

    return {
        message: "Publicação atualizada!",
        data: dashfoto
    }
  }
}
