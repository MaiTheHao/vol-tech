import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Voltech API',
		version: '1.0.0',
		description: 'Tài liệu API cho hệ thống quản lý hoạt động tình nguyện Voltech',
	},
	servers: [
		{
			url: '/api/v1',
			description: 'API Server v1',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
		schemas: {
			User: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
					},
					name: {
						type: 'string',
					},
					email: {
						type: 'string',
						format: 'email',
					},
					birthDate: {
						type: 'string',
						format: 'date-time',
					},
					unit: {
						type: 'string',
					},
					phone: {
						type: 'string',
					},
					score: {
						type: 'integer',
						minimum: 0,
						default: 0,
					},
					avatar: {
						type: 'string',
						nullable: true,
					},
					role: {
						type: 'array',
						items: {
							type: 'string',
						},
						default: ['user'],
					},
					deletedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
					},
				},
			},
			Active: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
					},
					title: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					startDate: {
						type: 'string',
						format: 'date-time',
					},
					endDate: {
						type: 'string',
						format: 'date-time',
					},
					points: {
						type: 'integer',
						minimum: 0,
					},
					status: {
						type: 'string',
						enum: ['closed', 'ongoing', 'completed', 'cancelled'],
						default: 'closed',
					},
					commune: {
						type: 'string',
					},
					location: {
						type: 'string',
					},
					maxParticipants: {
						type: 'integer',
						minimum: 1,
					},
					registeredUsers: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
					createdBy: {
						type: 'string',
					},
					images: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
					notes: {
						type: 'string',
						nullable: true,
					},
					deletedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
						default: new Date().toISOString(),
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
						default: new Date().toISOString(),
					},
				},
			},
			Province: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
					},
					code: {
						type: 'string',
					},
					name: {
						type: 'string',
					},
					deletedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
					},
				},
			},
			Commune: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
					},
					province: {
						type: 'string',
					},
					code: {
						type: 'string',
					},
					name: {
						type: 'string',
					},
					deletedAt: {
						type: 'string',
						format: 'date-time',
						nullable: true,
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
					},
				},
			},
			ErrorResponse: {
				type: 'object',
				properties: {
					error: {
						type: 'string',
					},
				},
			},
			LoginRequest: {
				type: 'object',
				required: ['email', 'password'],
				properties: {
					email: {
						type: 'string',
						format: 'email',
					},
					password: {
						type: 'string',
					},
				},
			},
			RegisterRequest: {
				type: 'object',
				required: ['name', 'email', 'password'],
				properties: {
					name: {
						type: 'string',
					},
					email: {
						type: 'string',
						format: 'email',
					},
					password: {
						type: 'string',
					},
					birthDate: {
						type: 'string',
						format: 'date-time',
					},
					unit: {
						type: 'string',
					},
					phone: {
						type: 'string',
					},
				},
			},
			LoginResponse: {
				allOf: [
					{
						$ref: '#/components/schemas/User',
					},
					{
						type: 'object',
						properties: {
							accessToken: {
								type: 'string',
							},
						},
					},
				],
			},
			RefreshTokenResponse: {
				type: 'object',
				properties: {
					accessToken: {
						type: 'string',
					},
				},
			},
			CreateActiveRequest: {
				type: 'object',
				required: ['title', 'description', 'startDate', 'endDate', 'points', 'status', 'commune', 'location', 'maxParticipants'],
				properties: {
					title: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					startDate: {
						type: 'string',
						format: 'date-time',
					},
					endDate: {
						type: 'string',
						format: 'date-time',
					},
					points: {
						type: 'integer',
						minimum: 0,
					},
					status: {
						type: 'string',
						enum: ['closed', 'ongoing', 'completed', 'cancelled'],
					},
					commune: {
						type: 'string',
					},
					location: {
						type: 'string',
					},
					maxParticipants: {
						type: 'integer',
						minimum: 1,
					},
					images: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
					notes: {
						type: 'string',
					},
				},
			},
		},
	},
	security: [
		{
			bearerAuth: [],
		},
	],
};

const options = {
	swaggerDefinition,
	apis: [path.resolve('./api/v1/**/*.js')],
};

export const swaggerSpec = swaggerJSDoc(options);
