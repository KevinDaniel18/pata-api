import {Module} from "@nestjs/common"
import { CommentsService } from "./comments.service";
import { PrismaService } from "prisma/prisma.service";
import { CommentsController } from "./comments.controller";

@Module({
    controllers: [CommentsController],
    providers: [CommentsService, PrismaService]
})

export class CommentsModule {}