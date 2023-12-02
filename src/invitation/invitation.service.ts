// invitation.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { VerifyInvitationDto } from './dto/verify-invitation.dto';

@Injectable()
export class InvitationService {
  private mailerTransport;
  private invitationStore: Record<
    string,
    { token: string; status: string; inviterId: string }
  > = {};

  constructor(private jwtService: JwtService) {
    this.mailerTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      port: 465,
    });
  }

  async sendPartnerInvitation(
    token: string,
    partnerEmail: string,
  ): Promise<{ message: string }> {
    const inviterId = this.extractUserIdFromToken(token);
    const invitationToken = this.generateInvitationToken(inviterId);
    const invitationLink = `https://your-app-url.com/signup?invitationToken=${invitationToken}`;

    const mailOptions = {
      from: 'your-email@example.com',
      to: partnerEmail,
      subject: 'Invitation to join Duo App',
      html: `<p>You have been invited to join Duo App. Please sign up using the following link: <a href="${invitationLink}">${invitationLink}</a></p>`,
    };

    this.invitationStore[partnerEmail] = {
      token: invitationToken,
      status: 'pending',
      inviterId: inviterId,
    };

    await this.mailerTransport.sendMail(mailOptions);

    return { message: 'Invitation sent successfully' };
  }

  checkInvitationToken(invitationToken: string): { inviterId: string } {
    for (const email in this.invitationStore) {
      if (this.invitationStore[email].token === invitationToken) {
        return { inviterId: this.invitationStore[email].inviterId };``
      }
    }
    throw new UnauthorizedException('Invalid invitation token');
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded.userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateInvitationToken(userId: string): string {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }

  async verifyInvitation(verifyInvitationDto: VerifyInvitationDto): Promise<{ inviterId: string }> {
    const { invitationToken } = verifyInvitationDto;
    try {
      const { inviterId } = this.checkInvitationToken(invitationToken);
      return { inviterId };
    } catch (error) {
      throw new NotFoundException('Invitation token not found');
    }
  }
}
