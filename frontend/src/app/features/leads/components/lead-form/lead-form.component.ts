import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { LeadService } from '../../../../core/services/lead.service';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    Textarea,
    Select,
    ButtonModule,
    InputMaskModule,
  ],
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
})
export class LeadFormComponent implements OnChanges {
  @Input() lead: Lead | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  formData: Lead = {
    nome: '',
    cpf: '',
    status: LeadStatus.NOVO,
    comentarios: '',
    municipio: '',
  };

  statusOptions = [
    { label: 'Novo', value: LeadStatus.NOVO },
    { label: 'Contato Inicial', value: LeadStatus.CONTATO_INICIAL },
    { label: 'Em Negociação', value: LeadStatus.EM_NEGOCIACAO },
    { label: 'Convertido', value: LeadStatus.CONVERTIDO },
    { label: 'Perdido', value: LeadStatus.PERDIDO },
  ];

  constructor(private leadService: LeadService) {} 

  ngOnChanges(changes: SimpleChanges): void {    if (changes['lead']) {
      if (this.lead) {
        this.formData = { ...this.lead };
      } else {
        this.formData = {
          nome: '',
          cpf: '',
          status: LeadStatus.NOVO,
          comentarios: '',
          municipio: '',
        };
      }
    }
  }


  onSubmit(): void {
    if (this.lead?.id) {
      // Enviar apenas os campos necessários para o update
      const updateData = {
        nome: this.formData.nome,
        cpf: this.formData.cpf,
        status: this.formData.status,
        comentarios: this.formData.comentarios,
        municipio: this.formData.municipio,
      };

      this.leadService.updateLead(this.lead.id, updateData).subscribe({
        next: () => {
          this.save.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar lead:', error);
        },
      });
    } else {
      // Para criar, enviar apenas os campos necessários
      const createData = {
        nome: this.formData.nome,
        cpf: this.formData.cpf,
        status: this.formData.status,
        comentarios: this.formData.comentarios,
        municipio: this.formData.municipio,
      };

      this.leadService.createLead(createData).subscribe({
        next: () => {
          this.save.emit();
        },
        error: (error) => {
          console.error('Erro ao criar lead:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

