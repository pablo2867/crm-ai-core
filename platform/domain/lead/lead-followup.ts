export class LeadFollowup {

  generate(
    name: string,
  ): string {

    return `Hola ${name}, seguimos disponibles para ayudarte cuando gustes.`;

  }

  action(): string {

    return "Enviar seguimiento comercial.";

  }

}

export const leadFollowup =
  new LeadFollowup();