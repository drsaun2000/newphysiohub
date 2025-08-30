import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto, SubmitQuizDto, AddPlayedByDto, FileUploadDto } from './dto/dto';
import { Quiz } from './quiz.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as multer from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { CloudinaryService } from '../helper/cloudinary.service';
import { UserService } from 'src/user/user.service';
import { Auth, GetUserId } from 'src/guard/authguard';
import { SirvService } from '../helper/sirv.service';
import { diskStorage } from 'multer';
import { memoryStorage } from 'multer';
import { extname } from 'path';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService,
    private readonly sirvService: SirvService,
  ) {}





    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: memoryStorage(),
       limits: { fileSize: 100 * 1024 * 1024 }, // Allow up to 100MB
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4'];
          if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG, PNG images and MP4 videos are allowed'), false);
          }
          cb(null, true);
        },
      }),
    )
    async uploadDirectToSirv(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      try {
        const baseFileName = `img-${Date.now()}-${file.originalname}`;
        const fileName = this.sirvService.sanitizeFileName(baseFileName);

        const url = await this.sirvService.uploadBuffer(file.buffer, fileName);

        return {
          statusCode: 201,
          message: 'File uploaded to Sirv successfully',
          data: { url },
        };
      } catch (error) {
        throw new BadRequestException({
          message: 'Upload to Sirv failed',
          error: error?.message || error,
        });
      }
    }



  @Auth()
  @Post('create')
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({ status: 201, description: 'Quiz successfully created.', type: Quiz })
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @GetUserId() userId: Types.ObjectId 
  ) {
    console.log("userId",userId);
    try {
      const quiz = await this.quizService.createQuiz(createQuizDto, userId); // Passing the user ID to the service
      return { statusCode: 201, message: 'Quiz created successfully', data: quiz };
    } catch (error) {
      throw new BadRequestException({ statusCode: 400, message: 'Failed to create quiz' });
    }
  }
    
  @Auth()
  @Get('my-quizzes')
  async getMyCreatedQuizzes(@GetUserId() userId: Types.ObjectId) {
    const quizzes = await this.quizService.getCreatedQuizzes(userId);
    return {
      statusCode: 200,
      message: 'Successfully fetched your quizzes',
      data: quizzes,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quiz by ID' })
  async getQuizById(@Param('id') quizId: string) {
    const quiz = await this.quizService.getQuizById(quizId);
    if (!quiz) throw new NotFoundException({ statusCode: 404, message: 'Quiz not found' });

    return { statusCode: 200, message: 'Quiz retrieved successfully', data: quiz };
  }

  @Get('by-topic/:mainTopicId')
  @ApiOperation({ summary: 'Fetch quizzes by main topic' })
  async getQuizzesByMainTopic(@Param('mainTopicId') mainTopicId: string) {
    const quizzes = await this.quizService.findQuizzesByMainTopic(mainTopicId);
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException({ statusCode: 404, message: 'No quizzes found for the given main topic ID' });
    }
    return { statusCode: 200, message: 'Quizzes fetched successfully', data: quizzes };
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  async getAllQuizzes() {
    const quizzes = await this.quizService.getAllQuizzes();
    return { statusCode: 200, message: 'Quizzes retrieved successfully', data: quizzes };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a quiz' })
  async updateQuiz(@Param('id') quizId: string, @Body() updateQuizDto: UpdateQuizDto) {
    const quiz = await this.quizService.updateQuiz(quizId, updateQuizDto);
    return { statusCode: 200, message: 'Quiz updated successfully', data: quiz };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  async deleteQuiz(@Param('id') quizId: string) {
    await this.quizService.deleteQuiz(quizId);
    return { statusCode: 200, message: 'Quiz deleted successfully' };
  }

  @Auth()
  @Post('/submit-quiz/:quizId')
  @ApiOperation({ summary: 'Submit quiz answers' })
  async submitQuiz(@Param('quizId') quizId: string, @Body() submitQuizDto: SubmitQuizDto, @GetUserId() userId: Types.ObjectId) {
    if (!userId) throw new BadRequestException({ statusCode: 400, message: 'User ID is required' });

    const response = await this.quizService.submitQuiz(quizId, userId, submitQuizDto.answers, submitQuizDto.completionTime);
    return { statusCode: 200, message: 'Quiz submitted successfully', data: response };
  }

  @Post('/generate-results/:quizId')
  @ApiOperation({ summary: 'Generate quiz results' })
  async generateResults(@Param('quizId') quizId: string) {
    const results = await this.quizService.generateResults(quizId);
    return { statusCode: 200, message: 'Quiz results generated successfully', data: results };
  }

  @Auth()
  @Post('join/:quizId')
  @ApiOperation({ summary: 'Join a quiz' })
  async joinQuiz(@Param('quizId') quizId: Types.ObjectId, @GetUserId() userId: Types.ObjectId) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException({ statusCode: 404, message: 'User not found' });

    if (user.joinedQuizzes.includes(new mongoose.Types.ObjectId(quizId))) {
      throw new BadRequestException({ statusCode: 400, message: 'User already joined this quiz' });
    }

    user.joinedQuizzes.push(new mongoose.Types.ObjectId(quizId));
    await user.save();

    return { statusCode: 200, message: 'Quiz joined successfully' };
  }

  @Put('played-by/:quizId')
  @ApiOperation({ summary: 'Add a user to the playedBy array of a quiz' })
  async addPlayedBy(@Param('quizId') quizId: string, @Body() addPlayedByDto: AddPlayedByDto) {
    const updatedQuiz = await this.quizService.addPlayedBy(quizId, addPlayedByDto.userId);
    return { statusCode: 200, message: 'User added to playedBy successfully', data: updatedQuiz };
  }

  @Get('has-played/:quizId')
  @ApiOperation({ summary: 'Check if a user has played the quiz' })
  async hasUserPlayedQuiz(@Param('quizId') quizId: string, @Body() body: { userId: string }) {
    const hasPlayed = await this.quizService.isUserPlayedQuiz(quizId, body.userId);
    return { statusCode: 200, message: 'Check completed', data: { hasPlayed } };
  }

  @Auth()
  @Post('/review-quiz/:quizId')
  @ApiOperation({ summary: 'Review quiz answers and provide feedback' })
  async reviewQuiz(@Param('quizId') quizId: string, @GetUserId() userId: Types.ObjectId) {
    if (!userId) throw new BadRequestException({ statusCode: 400, message: 'User ID is required' });

    const reviewData = await this.quizService.reviewQuizAnswers(quizId, userId);
    return { statusCode: 200, message: 'Quiz review retrieved successfully', data: reviewData };
  }


}
